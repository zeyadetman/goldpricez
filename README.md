# goldpricez

A command-line app to get the current gold prices

## Installation

[![NPM](https://nodei.co/npm/goldpricez.png)](https://nodei.co/npm/goldpricez/)

`npm i -g goldpricez`

## Usage

```
Usage: goldpricez [options]

You have to set at least one of the following options

Options:

    -u, --unit         Unit 'K' of the gold [ 24, 23, 22, ..., 9 ], default = 21
    -c, --currency     Currency of the price, default = EGP
    -s, --size         Size of the calculated [gram, kg, ounce, grain]

```

## Examples

`goldpricez -u=21 -c=EGP -s=gram`
✔ 21K = 736.251725 EGP
