import {RedisRepository} from "../src/infrastructure/persistence/redis/RedisRepository";

abstract class Animal {
    name: string = "";
    abstract sound(): void;
}

class Dog extends Animal {
    name = "dog";
    sound() {
        console.log("Barking");
    }
}

const dog: Animal = new Dog();
dog.sound();

// function callBack(): void {
//     console.log("Callback function");
// }

function asyncMethod(callBack: { (): void; (): void; }) {
    setTimeout(() => {
        console.log("Async Callback");
        callBack();
    }, 2000);
}
asyncMethod(() => console.log("Async Callback Completed"));

const redisRepository = new RedisRepository();
redisRepository.connect()
    .then(result => {
        console.log('connected to redis...\n', result);
        redisRepository.doSomething().then(r => console.log('Did something...\n', r));
    });