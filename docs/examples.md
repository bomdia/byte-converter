# More Examples

## AutoScale of a file

```js
import { B } from "@wtfcode/byte-converter";
import fs from "fs";

const stat = fs.statSync("file.mkv");

const value = B.value(stat.size).autoScale();

console.log(value.formatted());
```

## Measure Dir Size

```js
import { B, Unit } from "@wtfcode/byte-converter";
import fs from "fs";
import path from "path";

function sizeOfDir(dirPath) {
  let result = B.value(0);
  for (const file of fs.readdirSync(dirPath)) {
    result = result.plus(B.value(fs.statSync(path.join(dirPath, file)).size));
  }
  return result.autoScale(Unit.autoScaleDefaults.SameDecimal);
}

console.log(sizeOfDir("./largeDirectory").formatted());
```
