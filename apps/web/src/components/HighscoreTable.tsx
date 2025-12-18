import { type UserListHighscore } from "@ts-drones/shared";
import { Center, Table } from '@mantine/core';

interface HighscoreTableProps {
    highscore: UserListHighscore[];
}

export const HighscoreTable = ({ highscore }: HighscoreTableProps) => {
    return (
        <Center>
            <Table w={500}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Nickname</Table.Th>
                        <Table.Th>Combinations found</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {highscore.sort((a, b) => b.nbCombinationsFound - a.nbCombinationsFound).map((user) => (
                        <Table.Tr key={user.nickname}>
                            <Table.Td>{user.nickname}</Table.Td>
                            <Table.Td>{user.nbCombinationsFound}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Center>
    );
};
