import * as categoriesRepository from "./categories.repository.js";

export async function listCategories() {
  return categoriesRepository.findAllCategories();
}
