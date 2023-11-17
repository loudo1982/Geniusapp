type Author = {
  name: string;
  image: string;
  designation: string;
};

export type Blog = {
  id: number;
  title: string;
  paragraph: string;
  image: string;
  author: Author;
  tags: string[];
  publishDate: string;
};

export type Taller = {
  id: number;
  cupoMaximo: number;
  descripcion: string;
  nombre: string;
  image: string;
  displayName: string;
  fotocreador:string;
  email:string

};