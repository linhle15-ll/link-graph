import {
  fileRepository,
  edgeRepository,
  nodeRepository,
} from "../repository/index.js";

async function main() {
  const fileId = await fileRepository.creatFile("Causal Inference");
  const nodeId1 = await nodeRepository.createTestNode(
    "Causal inference in statistics: An overview",
    ["Judea Pearl"],
    "10.1214/09-SS057",
    fileId,
  );

  const nodeId2 = await nodeRepository.createTestNode(
    "A review of instrumental variable estimators for Mendelian randomization",
    ["Stephen Burgess", "Dylan S Small", "Simon G Thompson"],
    "10.1177/0962280215597579",
    fileId,
  );

  await edgeRepository.createTestEdge(
    89,
    "Instrumental variable is one of the principle methods of establishing causal inference",
    nodeId1,
    nodeId2,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
