import {
  RingProgress,
  Text,
  SimpleGrid,
  Paper,
  Center,
  Group,
} from "@mantine/core";
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconUsers,
  IconCurrencyRupee,
  IconCoinRupee,
  IconBuildingBank,
  IconUserCircle,
  IconNumber0,
  IconCircleNumber0,
} from "@tabler/icons-react";

const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
  groups: IconUsers,
  currency: IconCurrencyRupee,
  ruppee: IconCoinRupee,
  bank: IconBuildingBank,
  users: IconUserCircle,
  number: IconCircleNumber0,
};

export default function StatsRing({ data }) {
  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    return (
      <Paper withBorder radius="md" p="xs" key={stat.label} shadow="xl">
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: stat.progress, color: stat.color }]}
            label={
              <Center>
                <Icon size="1.4rem" stroke={1.5} />
              </Center>
            }
          />

          <div>
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              {stat.label}
            </Text>
            <Text weight={700} size="xl">
              {stat.stats}
            </Text>
          </div>
        </Group>
      </Paper>
    );
  });

  return (
    <SimpleGrid cols={4} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
      {stats}
    </SimpleGrid>
  );
}
