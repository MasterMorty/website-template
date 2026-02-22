import type { InferSelectModel } from "drizzle-orm";
import type { project, content } from "./schema";

export type ContentUI = Content & {
  _syncing?: boolean;
  tempId?: string;
};


export type ProjectWithContents = Project & {
  contents: ContentUI[];
};

export type Project = InferSelectModel<typeof project>;
export type Content = InferSelectModel<typeof content>;