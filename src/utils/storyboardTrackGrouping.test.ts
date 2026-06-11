import assert from "node:assert/strict";
import { groupStoryboardsForVideoTracks, normalizeSupportedDurations } from "./storyboardTrackGrouping";

const items = [3, 5, 3, 3, 3, 3, 2, 3, 5, 3].map((duration, index) => ({
  id: index + 1,
  duration,
}));

const groups = groupStoryboardsForVideoTracks(items, [5, 6, 7, 8, 9, 10]);

assert.deepEqual(
  groups.map((group) => group.items.map((item) => item.id)),
  [
    [1, 2],
    [3, 4],
    [5, 6],
    [7, 8],
    [9],
    [10],
  ],
);
assert.deepEqual(
  groups.map((group) => group.duration),
  [8, 6, 6, 5, 5, 5],
);
assert.ok(groups.every((group) => group.duration >= 5 && group.duration <= 10));

const snappedGroups = groupStoryboardsForVideoTracks(
  [
    { id: 1, duration: 3 },
    { id: 2, duration: 3 },
  ],
  [5, 10],
);
assert.equal(snappedGroups[0].rawDuration, 6);
assert.equal(snappedGroups[0].duration, 10);

assert.deepEqual(normalizeSupportedDurations([{ duration: [10, 5, 5] }]), [5, 10]);
assert.deepEqual(normalizeSupportedDurations(null), [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
assert.deepEqual(normalizeSupportedDurations([{ duration: [2, 3, 15, 3] }]), [2, 3, 15]);

const jimengGroups = groupStoryboardsForVideoTracks(
  [
    { id: 1, duration: 3 },
    { id: 2, duration: 3 },
    { id: 3, duration: 3 },
  ],
  [4, 5, 6, 7, 8, 9, 10],
);
assert.ok(jimengGroups.every((group) => group.duration >= 4));
assert.deepEqual(
  jimengGroups.map((group) => group.items.map((item) => item.id)),
  [[1, 2], [3]],
);
assert.deepEqual(
  jimengGroups.map((group) => group.duration),
  [6, 4],
);

const singleShortJimengGroup = groupStoryboardsForVideoTracks([{ id: 1, duration: 3 }], [4, 5, 6, 7, 8, 9, 10]);
assert.equal(singleShortJimengGroup[0].rawDuration, 3);
assert.equal(singleShortJimengGroup[0].duration, 4);

const supportedSingleStoryboardGroups = groupStoryboardsForVideoTracks(
  [
    { id: 1, duration: 4 },
    { id: 2, duration: 5 },
    { id: 3, duration: 15 },
  ],
  [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
);
assert.deepEqual(
  supportedSingleStoryboardGroups.map((group) => group.items.map((item) => item.id)),
  [[1], [2], [3]],
);
assert.deepEqual(
  supportedSingleStoryboardGroups.map((group) => group.duration),
  [4, 5, 15],
);
