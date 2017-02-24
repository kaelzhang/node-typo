const template = `a
 a{{b:a c}}d
 e{{f}}h
`

const tokens = [
  {
    "type": "String",
    "value": "a\n a",
    "loc": {
      "line": 1,
      "col": 1
    }
  },
  {
    "type": "Directive",
    "helpers": [
      {
        "type": "Helper",
        "name": "b",
        "param": "a",
        "loc": {
          "line": 2,
          "col": 5
        }
      }
    ],
    "replacer": {
      "type": "Replacer",
      "value": "c",
      "loc": {
        "line": 2,
        "col": 9
      }
    }
  },
  {
    "type": "String",
    "value": "d\n e",
    "loc": {
      "line": 2,
      "col": 12
    }
  },
  {
    "type": "Replacer",
    "value": "f",
    "loc": {
      "line": 3,
      "col": 5
    }
  },
  {
    "type": "String",
    "value": "h\n",
    "loc": {
      "line": 3,
      "col": 8
    }
  }
]


module.exports = {
  template,
  tokens
}
