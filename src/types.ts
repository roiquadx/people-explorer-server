export type PersonName = {
    title: string;
    first: string;
    last: string;
};

export type PersonAddress = {
    streetLine: string;
    city: string;
    state: string;
    country: string;
};

export type Person = {
    id: string;

    name: PersonName;
    gender: string;
    email: string;
    phone: string;

    age: number;
    yearOfBirth: number;

    address: PersonAddress;

    thumbnailUrl: string;
    pictureUrl: string;
};
