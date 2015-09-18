System.config({    
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  map: {
    "babel": "npm:babel-core@5.8.24",
    "babel-runtime": "npm:babel-runtime@5.8.24",
    "codemirror": "npm:codemirror@5.6.0",
    "core-js": "npm:core-js@1.1.4",
    "react": "npm:react@0.13.3",    
    "typescript": "npm:typescript@1.6.2"
  }
});
