import random
from collections import defaultdict


def simulate_red_distribution(trials=100000):
    total_diff = 0
    total_same = 0

    group_sizes = [4, 4, 4, 5, 5, 5]
    group_indices = []
    idx = 0
    for size in group_sizes:
        group_indices.append(list(range(idx, idx + size)))
        idx += size

    for _ in range(trials):
        # Randomly place red objects
        items = list(range(27))
        red_positions = set(random.sample(items, 3))

        # Assign positions to groups
        group_map = defaultdict(set)
        for i, group in enumerate(group_indices):
            for pos in group:
                if pos in red_positions:
                    group_map[i].add(pos)

        red_group_ids = [gid for gid,
                         members in group_map.items() if len(members) > 0]

        if len(red_group_ids) == 3:
            total_diff += 1
        elif len(red_group_ids) == 1:
            total_same += 1

    prob_diff = total_diff / trials
    prob_same = total_same / trials

    print(f"After {trials} trials:")
    print(f"Probability all 3 red in different groups: {prob_diff:.4f}")
    print(f"Probability all 3 red in the same group: {prob_same:.4f}")


if __name__ == "__main__":
    simulate_red_distribution()
