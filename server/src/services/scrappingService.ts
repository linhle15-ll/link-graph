import * as cheerio from "cheerio";
import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import { ScrapedNodeMetaData } from "../types/index.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import type { PDFDocumentProxy } from "pdfjs-dist/legacy/build/pdf.mjs";

const TIMEOUTMS: number = 15_000;
const BROWSER: string = "Mozilla/5.0";
const BOTNAME: string = "NexusBot/1.0";
const CONTACTSITE: string = "https://github.com/linhle15-ll/link-graph";
const HEADER: string = `${BROWSER} (compatible; ${BOTNAME}; +${CONTACTSITE}) `;
const MAXREDIRECT: number = 5;
const RETRIESCOUNT: number = 3;
const DOIREGEX: RegExp = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
// same DOI pattern, unanchored, for finding a DOI within a larger block of text
const DOISEARCHREGEX: RegExp = new RegExp(DOIREGEX.source.slice(1, -1), "i");
const ABSTRACT_HEADING_REGEX: RegExp = /^abstract\b[:\s]*/i;
const SECTION_HEADING_REGEX: RegExp =
  /^(introduction|keywords|1\.?\s+introduction)\b/i;
const AUTHOR_SPLIT_REGEX: RegExp = /\s*(?:,|;|&|\band\b)\s*/i;
const FONT_SIZE_EPSILON: number = 0.5;

// instantaneate axios client
const client: AxiosInstance = axios.create({
  timeout: TIMEOUTMS,
  headers: {
    "User-Agent": HEADER,
  },
  maxRedirects: MAXREDIRECT,
});

// retries
axiosRetry(client, {
  retries: RETRIESCOUNT,
  retryDelay: (retryCount) => retryCount * 1000,
  onRetry: (count, err) => console.log(`retry #${count} got ${err.message}`),
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
    error.code === "ECONNABORTED",
});

// title, link, authors, source and content summary if possible,
// updatedAt to now
export const scrapeForMetaData = async (
  link: string,
): Promise<ScrapedNodeMetaData | null> => {
  try {
    // validate url
    const url = new URL(link);
    if (!["https:", "http:"].includes(url.protocol)) {
      return null;
    }

    // a DOI in the link tells us it's a PDF without needing to probe content-type,
    // and the probe request itself gets 403'd by some publishers (e.g. ACM) for bot-like Range requests
    if (link.match(DOISEARCHREGEX)) {
      return processPdf(link);
    }

    // scrape
    const res = await client.get(link, {
      headers: { Range: "bytes=0-0" },
      responseType: "arraybuffer",
    });

    const contentType = (res.headers["content-type"] ?? "")
      .toString()
      .toLowerCase();

    if (contentType.includes("application/pdf")) {
      return processPdf(link);
    }

    if (contentType.includes("text/html")) {
      return processWeb(res.data);
    } else {
      console.error("Unsupported format: ", contentType);
    }
  } catch (error) {
    errorHandling(error);
  }
  return null;
};

/**
 * given link, return info of shape custom type
 **/
const processWeb = async (
  data: Buffer,
): Promise<ScrapedNodeMetaData | null> => {
  const selector = cheerio.load(data);

  const ogTitle = selector('meta[property="og:title"], meta[name="og:title"]')
    .first()
    .attr("content");
  const transTitle = ogTitle?.trim() || selector("title").first().text().trim();

  const authorsList: string[] = [];
  selector('meta[name="citation_author"]').each((_, el) => {
    const name = selector(el).attr("content")?.trim();
    authorsList.push(name ?? "");
  });

  const source = selector('meta[name="citation_doi"]').attr("content")?.trim();

  const abstract =
    selector(
      'meta[name="citation_abstract"], meta[name="DC.Description"], meta[property="og:description"]',
    )
      .first()
      .attr("content") ??
    selector("#abstract, .abstract, .abstract-content").first().text().trim();

  const newNode: ScrapedNodeMetaData = {
    title: transTitle,
    authors: authorsList,
    // link:link,
  };

  if (source) {
    newNode.source = source;
  }

  if (abstract) {
    newNode.contentSummary = abstract;
  }

  return newNode;
};

interface PdfTextItem {
  str: string;
  dir: string;
  transform: number[];
  width: number;
  height: number;
  fontName: string;
  hasEOL: boolean;
}

const isPdfTextItem = (item: unknown): item is PdfTextItem =>
  typeof item === "object" && item !== null && "str" in item;

// given link
// parse and then
const processPdf = async (
  link: string,
): Promise<ScrapedNodeMetaData | null> => {
  const loadingTask = pdfjsLib.getDocument({
    url: link,
    verbosity: pdfjsLib.VerbosityLevel.ERRORS,
  });
  let doc: PDFDocumentProxy | undefined;

  try {
    doc = await loadingTask.promise;
    const page = await doc.getPage(1);
    const textContent = await page.getTextContent();
    const items = textContent.items.filter(isPdfTextItem);

    const plainText = items
      .map((item) => item.str + (item.hasEOL ? "\n" : ""))
      .join("");

    // check if there is DOI, if so trigger getDataFromDoi (return the Scrapped metadata itself)
    const doiMatch = plainText.match(DOISEARCHREGEX);
    if (doiMatch) {
      return getDataFromDoi(doiMatch[0]);
    }

    // title = text run(s) with the largest font size on the page
    // authors = text run(s) with the next-largest distinct font size
    const fontSize = (item: PdfTextItem) =>
      Math.hypot(item.transform[0] ?? 0, item.transform[1] ?? 0);
    const candidateItems = items.filter((item) => item.str.trim().length > 0);
    const sizes = candidateItems.map(fontSize);
    const maxSize = Math.max(...sizes, 0);

    const title = candidateItems
      .filter((item) => Math.abs(fontSize(item) - maxSize) < FONT_SIZE_EPSILON)
      .map((item) => item.str.trim())
      .join(" ")
      .trim();

    const authorFontSize = Math.max(
      ...sizes.filter((size) => size < maxSize - FONT_SIZE_EPSILON),
      0,
    );
    const authorsLine = candidateItems
      .filter(
        (item) => Math.abs(fontSize(item) - authorFontSize) < FONT_SIZE_EPSILON,
      )
      .map((item) => item.str.trim())
      .join(" ")
      .trim();
    const authorsList = authorsLine
      .split(AUTHOR_SPLIT_REGEX)
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    // abstract = text following an "Abstract" heading, up to the next section heading
    const lines = plainText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    let abstract = "";
    const abstractStart = lines.findIndex((line) =>
      ABSTRACT_HEADING_REGEX.test(line),
    );
    if (abstractStart !== -1) {
      const abstractLines: string[] = [];
      for (let i = abstractStart; i < lines.length; i++) {
        const line =
          i === abstractStart
            ? lines[i]!.replace(ABSTRACT_HEADING_REGEX, "")
            : lines[i]!;
        if (i > abstractStart && SECTION_HEADING_REGEX.test(line)) break;
        if (line) abstractLines.push(line);
      }
      abstract = abstractLines.join(" ").trim();
    }

    const newNode: ScrapedNodeMetaData = {
      title,
      authors: authorsList,
    };

    if (abstract.length !== 0) {
      newNode.contentSummary = abstract;
    }

    return newNode;
  } catch (error) {
    if (error instanceof Error) {
      switch (error.name) {
        case "InvalidPDFException":
          console.error("Invalid PDF document: ", error.message);
          break;
        case "PasswordException":
          console.error("PDF is password protected: ", error.message);
          break;
        case "ResponseException":
          console.error("Failed to fetch PDF: ", error.message);
          break;
        case "UnknownErrorException":
          console.error("Unknown PDF parsing error: ", error.message);
          break;
        default:
          console.error(error);
      }
    } else {
      console.error(error);
    }
  } finally {
    if (doc) await doc.destroy();
  }
  return null;
};

// input: valid doi
// either a string of numbers or the actual web page itself;
export const getDataFromDoi = async (
  doi: string,
): Promise<ScrapedNodeMetaData | null> => {
  // if given string does not contain the checked prefix string
  // search for the start of the DOIRegex expression and attach the prefix string before that
  if (!doi.includes("https://doi.org")) {
    doi = `https://doi.org/${doi}`;
  }

  const res = await client.get(doi, {
    headers: { Range: "bytes=0-0" },
    responseType: "arraybuffer",
  });

  const selector = cheerio.load(res.data);

  // get node
  const title = selector(
    'meta[name="citation_title"], meta[name="DC.title"], meta[name="DCTERMS.title"]',
  )
    .first()
    .attr("content");

  if (!title) {
    return null;
  }

  // access node content
  const transTitle = title?.trim() || selector("title").first().text().trim();

  const authorsList: string[] = [];
  selector(
    'meta[name="citation_author"], meta[name="DC.creator"], meta[name="DCTERMS.creator"]',
  ).each((_, el) => {
    const name = selector(el).attr("content")?.trim();
    authorsList.push(name ?? "");
  });

  const abstractDomNode = selector(
    'meta[name="citation_abstract"], meta[name="DC.Description"], meta[name="dcterms.abstract"]',
  )
    .first()
    .attr("content");

  const newNode: ScrapedNodeMetaData = {
    title: transTitle,
    authors: authorsList,
    source: doi,
  };

  if (abstractDomNode) {
    newNode.contentSummary = abstractDomNode.trim();
  }

  return newNode;
};

const errorHandling = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error("Status code: ", error.response?.status);
    console.error("Server message: ", error.response?.data);
  } else if (error instanceof Error) {
    console.error("Standard error: ", error.message);
  } else {
    console.log("Unknown error: ", error);
  }
};
