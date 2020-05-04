export class Person {

    constructor(public id: string,
                public name: string,
                public invitedBy: Person = null,
                public photoUrl: string = null,
                public phone: number = null,
                public accepted: boolean = false,
                public admin: boolean = false,
                public fbLink: string = null) {}
}

export class Helper {
    id: string;
    name: string;
    helperId: string;
    description: string;
    constructor(person: Person, description: string) {
        this.name = person.name;
        this.helperId = person.id;
        this.description = description;
   }
}