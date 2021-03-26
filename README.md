![No longer maintained](https://img.shields.io/badge/Maintenance-OFF-red.svg)
### [DEPRECATED] This repository is no longer maintained
> I did this project as a NodeJS assignment for a job interview, so it was basically built upon the dictionary APIs provided by them, which I believe, no longer work, as the "batteries" are dead! 
>
> However, this project can be used as a reference to build interactive text based console clients. Feel free to fork and use it.
> 
> ~Shivam

# Command Line Dictionary  

A basic command line dictionary tool written in Nodejs.

## Getting started  

Make sure you have installed **node (version 8.17.0 or above)**. Visit https://nodejs.org/en/download/ for more info.

* Clone this repository
    ```sh
    git clone https://github.com/shivamshekhar/CommandLineDictionary.git
    ```
* Checkout into the working directory
    ```sh
    cd CommandLineDictionary
    ```
* Install dependencies using following command
    ```sh
    npm install
    ```
* Run 
    ```sh
    ./dict
    ```
    If you are facing any permission denied issues while running above command, ensure that the file is executable. You may use following command to achieve the same
    ```sh 
    chmod 755 dict 
    ```

## Supported commands  
1. Word Definitions : Display definitions of a given word.
    ```sh
    ./dict defn <word>
    ```
2. Word Synonyms : Display synonyms of a given word.
    ```sh
    ./dict syn <word>
    ```
3. Word Antonyms : Display antonyms of a given word.
    ```sh
    ./dic ant <word>
    ```
4. Word Examples : Display examples of usage of a given word in a sentence.
    ```sh
    ./dict ex <word>
    ```
5. Word Full Dictionary : Display Word Definitions, Word Synonyms, Word Antonyms & Word Examples for a given word.
    ```sh
    ./dict <word>
    ```
6. Word of the Day - Full Dictionary : Display Word Definitions, Word Synonyms, Word Antonyms & Word Examples for a random word.
    ```sh
    ./dict
    ```
7. Word Game : A game where a definition, a synonym or an antonym is displayed and user is asked to guess the actual word.
    ```sh
    ./dict play
    ```
    * Rules:
        * Enter the correct word to complete the game.
        * Any synonyms of the word(expected answer) would also be accepted as a correct answer.
        * If incorrect word is entered, user has 3 choices:
            * Try again : User can try again.
            * Hint : A hint is displayed. Hints could be:
                * The word is randomly jumbled (cat => atc, tac, tca)
                * Another definition of the word is displayed
                * Another antonym of the word is displayed
                * Another synonym of the word is displayed
            * Quit : Quit the game.

## Documentation

To generate code level documentation, run 
```sh
npm run docs
```

To access the documentation, open 
```sh
./docs/command-line-dictionary/<version>/index.js 
```

## Author

Shivam Shekhar  
Email : shivamshekhar299@gmail.com

## License

MIT
