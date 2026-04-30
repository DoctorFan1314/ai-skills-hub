export interface SkillVariable {
  name: string;
  placeholder: string;
  required: boolean;
  description?: string;
}

export interface BeforeAfterExample {
  input: string;
  outputs: {
    model: string;
    text: string;
  }[];
}

export interface RecommendedModel {
  name: string;
  strengths: string;
  useCase: string;
  audience: string;
}

export interface Skill {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  categorySlug: string;
  difficulty: "新手友好" | "进阶" | "高级";
  rating: number;
  usageCount: number;
  lastUpdated: string;
  version: string;
  tags: string[];
  featured: boolean;
  trending: boolean;
  beginner: boolean;
  promptOnline: string;
  promptLocal: string;
  variables: SkillVariable[];
  beforeAfter: BeforeAfterExample;
  recommendedModels: RecommendedModel[];
  usageStepsOnline: string[];
  usageStepsLocal: string[];
  advancedTips?: string[];
  likes: number;
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  description: string;
  skillCount: number;
  color: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}
