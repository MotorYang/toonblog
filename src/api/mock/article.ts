export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl?: string;
  tags: string[];
  views: number;
}

const INITIAL_ARTICLE: Article[] = [
  {
    id: '1',
    title: 'Why I Love Coding in Pajamas',
    excerpt:
      'The ultimate guide to comfort-driven development and why strict dress codes are overrated.',
    content: `
      Let's face it: productivity peaks when you are comfortable.

      ## The Elastic Waistband Advantage

      There is a direct correlation between the stretchiness of your waistband and the quality of your code. Studies (that I made up) show that developers in pajamas are 50% less likely to create bugs because they are too relaxed to stress about edge cases.

      ## Coffee Stains are Badges of Honor

      When you work from home in your favorite PJs, a coffee stain isn't a disaster; it's a timestamp of your morning stand-up.

      In conclusion, maximize your comfort to maximize your output.
    `,
    author: 'DevDood',
    date: '2023-10-24',
    category: 'Lifestyle',
    imageUrl: 'https://picsum.photos/800/400?random=1',
    tags: ['Coding', 'Humor', 'WFH'],
    views: 1205,
  },
  {
    id: '2',
    title: 'React vs. The World',
    excerpt: 'A cartoonish battle between web frameworks. Who will win the DOMination?',
    content: `
      Imagine a wrestling ring. In one corner, wearing blue trunks, the Component Crusher: React!

      In the other corner, the Green Giant: Vue!

      ## Round 1: Boilerplate

      React throws a hook! It's super effective. Vue counters with a v-model directive, simplifying two-way binding. The crowd goes wild.

      ## Round 2: Ecosystem

      React summons its massive ecosystem army. Libraries rain down from the sky. It's chaos. But wait, is that Svelte coming in with a steel chair?

      Ultimately, we're all winners because we get to build cool stuff.
    `,
    author: 'TechToon',
    date: '2023-10-25',
    category: 'Tech',
    imageUrl: 'https://picsum.photos/800/400?random=2',
    tags: ['React', 'Vue', 'Frontend'],
    views: 892,
  },
  {
    id: '3',
    title: 'Top 5 Snacks for Late Night Debugging',
    excerpt: 'Fuel your brain without getting cheese dust on your keyboard (optional).',
    content: `
      1. **Pretzels**: Low mess, high crunch. Satisfying aggression release when the API fails.
      2. **Gummy Bears**: Quick sugar rush for that recursive function logic.
      3. **Dark Chocolate**: Sophisticated, just like your refactored code.
      4. **Popcorn**: Risky, but worth it. Use chopsticks to keep fingers clean.
      5. **Water**: Boring, but necessary. Stay hydrated, folks.
    `,
    author: 'SnackMaster',
    date: '2023-10-26',
    category: 'Food',
    imageUrl: 'https://picsum.photos/800/400?random=3',
    tags: ['Food', 'Health', 'Tips'],
    views: 430,
  },
];

let mockArticles: Article[] = [...INITIAL_ARTICLE];

const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const articleApi = {
  article: {
    getAll: async (): Promise<Article[]> => {
      await delay();
      return [...mockArticles];
    },

    getById: async (id: string): Promise<Article | undefined> => {
      await delay(500);
      return mockArticles.find((p) => p.id === id);
    },

    create: async (post: Article): Promise<Article> => {
      await delay();
      mockArticles = [post, ...mockArticles];
      return post;
    },

    delete: async (id: string): Promise<void> => {
      await delay();
      mockArticles = mockArticles.filter((p) => p.id !== id);
    },

    incrementViews: async (id: string): Promise<number> => {
      await delay(300); // Faster for interactions
      const postIndex = mockArticles.findIndex((p) => p.id === id);
      if (postIndex > -1) {
        const currentViews = mockArticles[postIndex].views || 0;
        mockArticles[postIndex] = {
          ...mockArticles[postIndex],
          views: currentViews + 1,
        };
        return mockArticles[postIndex].views;
      }
      return 0;
    },
  },
};
