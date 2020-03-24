export class Person {

    constructor(public id: string,
                public name: string,
                public invitedBy: Person,
                public photoUrl: string,
                public phone: number,
                public fbLink: string) {}
}

export class Helper {
    constructor(public person: Person,
                public description: string) {}
}