import { fetchAllTags } from "./tag.repo";
import { mapToTag } from "./tag.mapper";
import { Tag } from "./tag.type";

export async function getAllTags(): Promise<Tag[]> {
  const tags = await fetchAllTags();
  return tags.map(mapToTag);
}
