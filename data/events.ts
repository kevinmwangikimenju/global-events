export type EventType = {

  id: number;

  name: string;

  image: string;

  gallery: string[];

  description: string;

  location: string;

  mapLink: string;

  price: string;

  date: string;

};



export let events: EventType[] = [];



export function addEvent(event: EventType) {

  events.push(event);

}