export const transformDataForGraph = (data: any): number[] => {
    // Transform the incoming data into a format suitable for the graph
    return data.map((point: any) => point.value);
};

export const formatDataForDisplay = (data: any): string => {
    // Format the incoming data for textual display
    return `Latest Value: ${data[data.length - 1].value}`;
};