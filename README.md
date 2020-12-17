# README

This package has all the core-stemmers (and a few additional ones) from
https://snowballstem.org/ compiled to JS with the snowball compiler and wrapped in a CommonJS-boilerplate ready to be used from node.js.

## Features

- All stemmers listed at https://snowballstem.org/algorithms/ are exported separately.
- Typescript typedefinitions included

## Usage

```
import { GermanStemmer } from 'snowball-stemmers';

const germanStemmer = new GermanStemmer();
console.log(germanStemmer.stemWord('hunde'));
// -> "hund"
```
