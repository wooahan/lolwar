import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

interface ChampionEntryProps {
  onDropChampion: (champion: any, position: string, teamType: string) => void;
}

const ChampionEntry: React.FC<ChampionEntryProps> = ({ onDropChampion }) => {
  const [champions, setChampions] = useState<string[]>([]);
  const [championSearchTerm, setChampionSearchTerm] = useState('');

  // Load champions from local images folder
  useEffect(() => {
    const fetchChampions = async () => {
      try {
        // Assuming images are in /images/champions/ and named by champion name
        const championNames = [
          'Aatrox', 'Ahri', 'Akali', 'Alistar', 'Amumu', 'Anivia', 'Annie',
          'Ashe', 'AurelionSol', 'Azir', 'Bard', 'Blitzcrank', 'Brand',
          'Braum', 'Caitlyn', 'Camille', 'Cassiopeia', 'Chogath', 'Corki'
          // Add more names based on the champions available in the folder
        ];
        setChampions(championNames);
      } catch (error) {
        console.error('Error fetching champions:', error);
      }
    };
    fetchChampions();
  }, []);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const { source, destination } = result;

    // Handle champion drop logic here if needed
    console.log(`Champion moved from ${source.index} to ${destination.index}`);
  };

  return (
    <div>
      <h2>챔피언 목록</h2>
      <input
        type="text"
        placeholder="챔피언 검색"
        value={championSearchTerm}
        onChange={(e) => setChampionSearchTerm(e.target.value)}
      />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="champion-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                border: '1px solid black',
                padding: '10px',
                height: '400px',
                overflowY: 'scroll',
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '10px',
              }}
            >
              {champions
                .filter((champion) =>
                  champion.toLowerCase().includes(championSearchTerm.toLowerCase())
                )
                .map((champion, index) => (
                  <Draggable key={champion} draggableId={champion} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          textAlign: 'center',
                          opacity: snapshot.isDragging ? 0.5 : 1,
                          cursor: 'pointer',
                        }}
                      >
                        <img
                          src={`/images/champions/${champion}.png`}
                          alt={champion}
                          style={{ width: '80px', height: '80px' }}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ChampionEntry;
