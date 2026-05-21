import { defineConfig, type RegistryItem } from 'jsrepo';
import { output } from '@jsrepo/shadcn';
import { componentMetadata } from './src/constants/Information.js';

type Category = 'Components';
type Variant = 'JS-CSS' | 'JS-TW' | 'TS-CSS' | 'TS-TW';

interface ComponentMeta {
  name: string;
  description: string;
  category: Category;
  variants?: readonly Variant[];
  meta?: Record<string, string>;
}

export default defineConfig({
  registry: {
    name: '@community-bits',
    homepage: 'https://community-bits.vercel.app',
    description:
      'A community-driven collection of animated, interactive React components shipped as copyable source.',
    authors: ['community-bits'],
    excludeDeps: ['react'],
    outputs: [output({ dir: 'public/r', format: true })],
    items: [
      ...Object.values(componentMetadata as Record<string, ComponentMeta>).flatMap(component =>
        defineComponent({
          title: component.name,
          description: component.description,
          category: component.category,
          meta: component.meta,
          variants: component.variants
        })
      )
    ]
  }
});

function defineComponent({
  title,
  description,
  category,
  meta,
  variants = ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW']
}: {
  title: string;
  description: string;
  category: Category;
  meta?: Record<string, string>;
  variants?: readonly Variant[];
}): RegistryItem[] {
  const baseItem: Omit<RegistryItem, 'files' | 'name'> = {
    title,
    description,
    type: 'registry:component',
    categories: [category],
    meta
  };

  const buildItem = (variant: Variant, dir: string): RegistryItem => ({
    ...baseItem,
    name: `${title}-${variant}`,
    files: [{ path: `src/${dir}/${category}/${title}` }]
  });

  const items: RegistryItem[] = [];
  if (variants.includes('JS-CSS')) items.push(buildItem('JS-CSS', 'content'));
  if (variants.includes('JS-TW')) items.push(buildItem('JS-TW', 'tailwind'));
  if (variants.includes('TS-CSS')) items.push(buildItem('TS-CSS', 'ts-default'));
  if (variants.includes('TS-TW')) items.push(buildItem('TS-TW', 'ts-tailwind'));
  return items;
}
