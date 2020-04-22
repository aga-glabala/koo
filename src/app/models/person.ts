export class Person {

    constructor(public id: string,
                public name: string,
                public invitedBy: Person,
                public photoUrl: string,
                public phone: number,
                public fbLink: string) {}
}

export class Helper {
    id: string;
    name: string;
    helperId: string;
    description: string;
    constructor(person: Person, description: string) {
        this.name = person.name;
        this.helperId = person.id;
        this.description = description
   }
}