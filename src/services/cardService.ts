// Card Service
export async function getCards() {
  try {
    const response = await fetch('/api/cards');
    return await response.json();
  } catch (error) {
    console.error('Get cards error:', error);
    throw error;
  }
}

export async function addCard(cardData: any) {
  try {
    const response = await fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardData),
    });
    return await response.json();
  } catch (error) {
    console.error('Add card error:', error);
    throw error;
  }
}
