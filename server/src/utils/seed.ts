import {
  fileRepository,
  userRepository,
  nodeRepository,
} from "../repository/index.js";
import { CreateNodeInput } from "../types/index.js";
async function main() {
  const userId = await userRepository.createUser(
    "user1",
    "user1@gmail.com",
    "rawPassword",
  );
  const fileId = await fileRepository.creatFile("Causal Inference", userId);

  const nodeInput1: CreateNodeInput = {
    title: "Causal inference in statistics: An overview",
    authors: ["Judea Pearl"],
    source: "10.1214/09-SS057",
    knowledgeFileId: fileId,
    link: "https://projecteuclid.org/journals/statistics-surveys/volume-3/issue-none/Causal-inference-in-statistics-An-overview/10.1214/09-SS057.full",
  };

  const nodeId1 = await nodeRepository.postNode(nodeInput1);

  const nodeId2 = await nodeRepository.postNode({
    title:
      "A review of instrumental variable estimators for Mendelian randomization",

    authors: ["Stephen Burgess", "Dylan S Small", "Simon G Thompson"],
    source: "10.1177/0962280215597579",
    knowledgeFileId: fileId,
    link: "https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://pubmed.ncbi.nlm.nih.gov/26282889/&ved=2ahUKEwjzudnm9_WVAxWZtlYBHbuNHIEQFnoECCIQAQ&usg=AOvVaw3dhfmNzX7-bCSdk6IaazDt",
  });

  // await edgeRepository.createTestEdge(
  //   89,
  //   "Instrumental variable is one of the principle methods of establishing causal inference",
  //   nodeId1,
  //   nodeId2,
  // );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
