#!/bin/bash
## declare an array variable

declare -a arr=(
  "../unifyre-native-wallet-components/node_modules/ferrum-crypto/"
)

echo "Compiling"

./node_modules/typescript/bin/tsc

echo "Compiled"

## now loop through the above array
for path in "${arr[@]}"
do
  echo "copy to $path"
  cp -rf './dist' $path
done

