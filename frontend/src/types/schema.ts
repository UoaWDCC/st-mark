export interface IImage {
  _id: string;
  url: string;
}

export interface IAnecdote {
  _id: string;
  content: string;
}

export interface ILink {
  _id: string;
  title: string;
  url: string;
}

export interface ICoordinate {
  lat: number;
  lng: number;
}

export interface IPlot {
  _id: string;
  plotNumber: number;
  registeredName: string;
  coordinates: ICoordinate[];
  buried: IPerson[];
}

export interface IDate {
  year?: number;
  month?: number;
  day?: number;
}

export interface IName {
  first?: string;
  middles?: string;
  last: string;
}

export interface IPerson {
  _id: string;
  name: IName;
  fullName: string;
  dateOfBirth?: IDate;
  dateOfDeath?: IDate;
  plot?: Omit<IPlot, "coordinates">;
}

export interface IPersonAll extends IPerson {
  displayImage?: Omit<IImage, "_id">;
  biography?: string;
  images: IImage[];
  links: ILink[];
  anecdotes: IAnecdote[];
  plotMembers: Pick<IPerson, "_id" | "name" | "fullName">[];
}
