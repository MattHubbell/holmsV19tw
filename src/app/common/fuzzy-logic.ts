// fuzzymatch.ts - Basic fuzzy matching and filter functions.
//
// Full explanation and usage here:
// https://jonbeebe.net/2023/12/basic-fuzzy-matching-function
//

export const fuzzyMatch = (searchFor: string, inTarget: string): number => {
  const search = (searchFor || "").trim().toLowerCase();
  const target = (inTarget || "").trim().toLowerCase();
  const searchLength = search.length;
  const targetLength = target.length;

  // early return conditions
  if (searchLength > targetLength) return 0; // search can't be longer than target
  if (search === target) return 1.0; // search same as target is an exact match

  // convert search and target to arrays
  const searchChars = search.split("");
  const targetChars = target.split("");

  let hits = 0; // count of matching chars
  let hitIdx = -1; // tracks index of last hit char

  for (let i = 0; i < searchLength; i += 1) {
    const searchChar = searchChars[i];

    // start searching target at next char (previous hit index + 1, or 0)
    for (let j = hitIdx + 1; j < targetLength; j += 1) {
      const targetChar = targetChars[j];

      if (searchChar === targetChar) {
        // match; increment hit, record index and move onto the next search char
        hits += 1;
        hitIdx = j;
        break;
      }

      // if final char of target is not a match, we now know that all chars
      // cannot be matched in the target; abort (no match)
      if (j === targetLength - 1) {
        return 0;
      }
    }
  }

  // weight is the ratio of hits to target length
  return hits / targetLength;
};

type FuzzyMatch = {
  weight: number;
  obj: any;
};

export const fuzzyFilter = (
  search: string,
  targets: any[],
  keys: string[],
): any[] => {
  const matches: FuzzyMatch[] = [];

  for (let i = 0; i < targets.length; i += 1) {
    const obj = targets[i];
    let highestWeight = 0;
    let matchIdx = -1;

    // call fuzzyMatch() on the value of each key to determine weight
    for (let j = 0; j < keys.length; j += 1) {
      const key = keys[j];

      // allow string and number values to be searched)
      if (typeof obj[key] === "string" || typeof obj[key] === "number") {
        const target = `${obj[key]}`;
        const weight = fuzzyMatch(search, target);

        if (weight) {
          if (matchIdx < 0) {
            // first key match was found; add obj to the list of matches
            matchIdx = matches.length;
            matches.push({ weight, obj });
          }

          // in case match was found in another key, check weight to see if
          // greater and update the weight if so
          if (weight > highestWeight) {
            matches[matchIdx].weight = weight;
            highestWeight = weight;
          }
          break;
        }
      }
    }
  }

  // sort matches; highest weight first
  matches.sort((mA: FuzzyMatch, mB: FuzzyMatch) => {
    const a = mA.weight;
    const b = mB.weight;
    if (a > b) return -1;
    if (a < b) return 1;
    return 0;
  });

  return matches.map((match) => match.obj);
};