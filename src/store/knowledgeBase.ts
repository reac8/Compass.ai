import { atom } from 'jotai';

interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'document';
  category: string;
  tags: string[];
  metadata: {
    author: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    status: 'draft' | 'review' | 'approved';
  };
  references: string[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  children: Category[];
}

// State atoms
export const entriesAtom = atom<KnowledgeEntry[]>([]);
export const categoriesAtom = atom<Category[]>([]);
export const selectedEntryAtom = atom<KnowledgeEntry | null>(null);
export const selectedCategoryAtom = atom<string | null>(null);
export const searchQueryAtom = atom('');
export const isEditingAtom = atom(false);

// Action atoms
export const addEntryAtom = atom(
  null,
  (get, set, entry: Omit<KnowledgeEntry, 'id' | 'metadata'>) => {
    const entries = get(entriesAtom);
    const newEntry: KnowledgeEntry = {
      ...entry,
      id: Math.random().toString(36).slice(2),
      metadata: {
        author: 'Current User', // Replace with actual user
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        status: 'draft'
      }
    };
    set(entriesAtom, [...entries, newEntry]);
  }
);

export const updateEntryAtom = atom(
  null,
  (get, set, update: Partial<KnowledgeEntry> & { id: string }) => {
    const entries = get(entriesAtom);
    set(
      entriesAtom,
      entries.map(entry =>
        entry.id === update.id
          ? {
              ...entry,
              ...update,
              metadata: {
                ...entry.metadata,
                updatedAt: new Date().toISOString(),
                version: entry.metadata.version + 1
              }
            }
          : entry
      )
    );
  }
);

export const deleteEntryAtom = atom(null, (get, set, id: string) => {
  const entries = get(entriesAtom);
  set(entriesAtom, entries.filter(entry => entry.id !== id));
});

export const addCategoryAtom = atom(
  null,
  (get, set, category: Omit<Category, 'id' | 'children'>) => {
    const categories = get(categoriesAtom);
    const newCategory: Category = {
      ...category,
      id: Math.random().toString(36).slice(2),
      children: []
    };
    set(categoriesAtom, [...categories, newCategory]);
  }
);

export const updateCategoryAtom = atom(
  null,
  (get, set, update: Partial<Category> & { id: string }) => {
    const categories = get(categoriesAtom);
    set(
      categoriesAtom,
      categories.map(category =>
        category.id === update.id ? { ...category, ...update } : category
      )
    );
  }
);

export const deleteCategoryAtom = atom(null, (get, set, id: string) => {
  const categories = get(categoriesAtom);
  set(categoriesAtom, categories.filter(category => category.id !== id));
});

// Computed atoms
export const filteredEntriesAtom = atom(get => {
  const entries = get(entriesAtom);
  const searchQuery = get(searchQueryAtom).toLowerCase();
  const selectedCategory = get(selectedCategoryAtom);

  return entries.filter(entry => {
    const matchesSearch =
      !searchQuery ||
      entry.title.toLowerCase().includes(searchQuery) ||
      entry.content.toLowerCase().includes(searchQuery) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchQuery));

    const matchesCategory = !selectedCategory || entry.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
});