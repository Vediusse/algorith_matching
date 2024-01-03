import * as fs from 'fs';

interface Men {
    type: 'Men';
}

interface Women {
    type: 'Women';
}


interface Person {
    name: string;
    gender: Men | Women;
    favorites: Person[];
    engagementIndex: number;
    engagement: Person | undefined;
    index: number;
    requestIndex: number;
}

class GameMatching {
    private amount: number;
    public mens: Person[] = [];
    public womens: Person[] = [];


    constructor(amount: number) {
        this.amount = amount;
        this.addPeople()
        this.addFavorites()
    }

    private addPeople(): void {
        const male_names: string[] = fs.readFileSync('male-first-names.txt', 'utf-8').trim().split('\n');
        const female_names: string[] = fs.readFileSync('female-first-names.txt', 'utf-8').trim().split('\n');
        for (let i: number = 0; i < this.amount; i++) {
            const randomFemaleIndex: number = Math.floor(Math.random() * female_names.length);
            const randomMaleIndex: number = Math.floor(Math.random() * male_names.length);
            this.mens.push({
                name: male_names[randomMaleIndex],
                gender: {type: 'Men'},
                favorites: [],
                engagementIndex: this.amount + 1,
                engagement: undefined,
                index: i,
                requestIndex: 0,
            });
            this.womens.push({
                name: female_names[randomFemaleIndex],
                gender: {type: 'Women'},
                favorites: [],
                engagementIndex: this.amount + 1,
                engagement: undefined,
                index: i,
                requestIndex: 0,
            });
        }
    }

    private addFavorites(): void {
        for (const man of this.mens) {
            man.favorites = this.shuffleArray(this.womens.slice());
        }
        for (const woman of this.womens) {
            woman.favorites = this.shuffleArray(this.mens.slice());
        }
    }


    protected shuffleArray(array: Person[]): Person[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Эффективно меняем местами elements i и j.
        }
        return array;
    }

    public mainLogic(): string {
        for (let men of this.mens) {

        }
        while (this.mens.some(men => men.engagementIndex === this.amount + 1)) {
            for (let men of this.mens) {
                if (men.engagementIndex === this.amount + 1) {
                    let mostWantedWomen: Person = men.favorites[men.requestIndex]
                    if (mostWantedWomen.engagementIndex === this.amount + 1) {
                        mostWantedWomen.engagementIndex = mostWantedWomen.favorites.indexOf(men);
                        men.engagementIndex = men.requestIndex;
                        men.engagement = mostWantedWomen;
                        mostWantedWomen.engagement = men;
                    } else if (mostWantedWomen.engagementIndex > mostWantedWomen.favorites.indexOf(men)) {
                        mostWantedWomen.engagement.engagementIndex = this.amount + 1
                        mostWantedWomen.engagementIndex = mostWantedWomen.favorites.indexOf(men);
                        men.engagementIndex = men.requestIndex;
                        men.engagement = mostWantedWomen;
                        mostWantedWomen.engagement = men;
                    }
                    men.requestIndex++;
                }

            }
        }
        return this.getStatistic();
    }

    protected getStatistic(): string {
        let resultString: string = "";
        for (let men of this.mens) {
            resultString += `${men.name} был женат на ${men.engagement.name}\n`
            resultString += `(в приоритете ${men.requestIndex}) (вот его приоритеты ${men.favorites.map((person: Person) => person.name)}) \n`;
            resultString += `(в приоритете ${men.engagement.favorites.indexOf(men) + 1}) (ее приоритеты ${men.engagement.favorites.map((person) => person.name)}) \n`;
            resultString += `---------------------------------------------------------------------------------\n`;
        }
        return resultString;
    }


}

let gm: GameMatching = new GameMatching(1000);
console.log(gm.mainLogic());