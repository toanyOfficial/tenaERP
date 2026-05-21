export type BatchIdentity = {
  batchGroup: string;
  batchSeq: number;
};

export type CreateBatchLogInput = BatchIdentity & {
  title: string;
  executedDate?: Date;
};
