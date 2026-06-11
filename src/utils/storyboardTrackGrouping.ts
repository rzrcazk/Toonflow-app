export interface StoryboardDurationItem {
  id: number;
  duration?: string | number | null | undefined;
}

export interface StoryboardTrackGroup<T extends StoryboardDurationItem> {
  items: T[];
  rawDuration: number;
  duration: number;
}

export function normalizeSupportedDurations(durationResolutionMap: unknown, fallback = range(2, 15)): number[] {
  if (!Array.isArray(durationResolutionMap)) return fallback;

  const durations = durationResolutionMap
    .flatMap((item: any) => (Array.isArray(item?.duration) ? item.duration : []))
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0);

  const unique = [...new Set(durations)].sort((a, b) => a - b);
  return unique.length ? unique : fallback;
}

export function groupStoryboardsForVideoTracks<T extends StoryboardDurationItem>(
  storyboards: T[],
  supportedDurations: number[],
): StoryboardTrackGroup<T>[] {
  const durations = normalizeSupportedDurationList(supportedDurations);
  const minDuration = durations[0];
  const maxDuration = durations[durations.length - 1];
  const groups: StoryboardTrackGroup<T>[] = [];
  let current: T[] = [];
  let currentDuration = 0;

  const flush = () => {
    if (!current.length) return;
    groups.push({
      items: current,
      rawDuration: currentDuration,
      duration: snapToSupportedDuration(currentDuration, durations),
    });
    current = [];
    currentDuration = 0;
  };

  for (let index = 0; index < storyboards.length; index += 1) {
    const item = storyboards[index];
    const itemDuration = readDuration(item.duration);

    if (!current.length && itemDuration >= minDuration) {
      groups.push({
        items: [item],
        rawDuration: itemDuration,
        duration: snapToSupportedDuration(itemDuration, durations),
      });
      continue;
    }

    if (current.length && currentDuration + itemDuration > maxDuration) {
      flush();

      if (itemDuration >= minDuration) {
        groups.push({
          items: [item],
          rawDuration: itemDuration,
          duration: snapToSupportedDuration(itemDuration, durations),
        });
        continue;
      }
    }

    current.push(item);
    currentDuration += itemDuration;

    if (currentDuration >= minDuration) {
      flush();
    }
  }

  flush();

  return groups;
}

function normalizeSupportedDurationList(supportedDurations: number[]): number[] {
  const durations = [...new Set(supportedDurations.map(Number).filter((value) => Number.isFinite(value) && value > 0))].sort((a, b) => a - b);
  return durations.length ? durations : range(2, 15);
}

function snapToSupportedDuration(duration: number, supportedDurations: number[]): number {
  return supportedDurations.find((supportedDuration) => supportedDuration >= duration) ?? supportedDurations[supportedDurations.length - 1];
}

function readDuration(duration: StoryboardDurationItem["duration"]): number {
  const value = Number(duration);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
