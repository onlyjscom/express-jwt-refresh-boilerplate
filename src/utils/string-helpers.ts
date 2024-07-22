export const capitalize = <T extends string>(s: T, locale = 'en') => {
    const words = s.split(' ');

    return words
        .map(
            (word) =>
                (word[0]?.toLocaleUpperCase(locale) ?? '') +
                word.slice(1)?.toLocaleLowerCase(locale) ?? '',
        )
        .join(' ') as Capitalize<Lowercase<typeof s>>;
};
