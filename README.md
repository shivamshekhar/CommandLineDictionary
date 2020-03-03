# Command Line Dictionary 

A basic command line dictionary tool written in Nodejs.

## Supported commands :
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
    Rules:
        - Enter the correct word to complete the game.
        - Any synonyms of the word(expected answer) would also be accepted as a correct answer.
        - If incorrect word is entered, user has 3 choices:
            1. Try again : User can try again.
            2. Hint : A hint is displayed. Hints could be:
                2.a The word is randomly jumbled (cat => atc, tac, tca)
                2.b Another definition of the word is displayed
                2.c Another antonym of the word is displayed
                2.d Another synonym of the word is displayed
            3. Quit : Quit the game.

## Getting started

## Author

Shivam Shekhar : shivamshekhar299@gmail.com

## License

MIT