import { fetchAllTags, fetchTagBySlug } from "./tag.repo";
import { mapToTag } from "./tag.mapper";
import { Tag } from "./tag.type";

export async function getAllTags(limit?: number): Promise<Tag[]> {
  const tags = await fetchAllTags(limit);
  return tags.map(mapToTag);
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  return await fetchTagBySlug(slug);
}
