import { fetchAllTags } from "./tag.repo";
import { mapToTag } from "./tag.mapper";
import { Tag } from "./tag.type";

export async function getAllTags(limit?: number): Promise<Tag[]> {
  const tags = await fetchAllTags(limit);
  return tags.map(mapToTag);
}
