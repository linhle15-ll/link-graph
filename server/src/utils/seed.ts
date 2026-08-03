import {
  knowledgeFileRepository,
  userRepository,
  nodeRepository,
  edgeRepository,
} from "../repository/index.js";
import { CreateNodeInput, CreateEdgeInput } from "../types/index.js";

async function main() {
  const userRepo = new userRepository.UserRepository();

  const userId = await userRepo.createUser(
    "user1",
    "user1@gmail.com",
    "rawPassword",
  );
  const fileId = await knowledgeFileRepository.creatFile(
    "Causal Inference",
    userId,
  );

  const nodeInput1: CreateNodeInput = {
    title: "Causal inference in statistics: An overview",
    authors: ["Judea Pearl"],
    source: "10.1214/09-SS057",
    knowledgeFileId: fileId,
    link: "https://projecteuclid.org/journals/statistics-surveys/volume-3/issue-none/Causal-inference-in-statistics-An-overview/10.1214/09-SS057.full",
  };

  const node1 = await nodeRepository.postNode(nodeInput1);

  const node2 = await nodeRepository.postNode({
    title:
      "A review of instrumental variable estimators for Mendelian randomization",

    authors: ["Stephen Burgess", "Dylan S Small", "Simon G Thompson"],
    source: "10.1177/0962280215597579",
    knowledgeFileId: fileId,
    link: "https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://pubmed.ncbi.nlm.nih.gov/26282889/&ved=2ahUKEwjzudnm9_WVAxWZtlYBHbuNHIEQFnoECCIQAQ&usg=AOvVaw3dhfmNzX7-bCSdk6IaazDt",
  });

  const edgeInput: CreateEdgeInput = {
    knowledgeFileId: fileId,
    nodeIds: [node1.id, node2.id],
    score: 89,
    reason:
      "Instrumental variable is one of the principle methods of establishing causal inference",
  };

  await edgeRepository.postEdge(edgeInput);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
