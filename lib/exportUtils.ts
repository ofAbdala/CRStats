import { Battle } from './types';

export function exportBattlesToCSV(battles: Battle[], filename: string = 'battles.csv') {
    if (!battles || battles.length === 0) return;

    const headers = [
        'Data',
        'Tipo',
        'Resultado',
        'Coroas (Você)',
        'Coroas (Oponente)',
        'Troféus (Mudança)',
        'Oponente',
        'Deck (Cartas)'
    ];

    const rows = battles.map(battle => {
        const team = battle.team[0];
        const opponent = battle.opponent[0];
        const result = team.crowns > opponent.crowns ? 'Vitória' : team.crowns < opponent.crowns ? 'Derrota' : 'Empate';
        const deckString = team.cards.map(c => c.name).join(' | ');

        return [
            new Date(battle.battleTime).toLocaleString(),
            battle.type,
            result,
            team.crowns,
            opponent.crowns,
            team.trophyChange || 0,
            opponent.name,
            `"${deckString}"` // Quote to handle separators inside
        ].join(',');
    });

    const csvContent = [
        headers.join(','),
        ...rows
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
