import { programs, residents } from '../resources/backend.json';
interface DistinctProgramProps {
  hobbies: string[];
  levelsOfCare: string[];
};

export function getDistinctPrograms(): Map<string, DistinctProgramProps> {

  const distinctPrograms = new Map<string, DistinctProgramProps>();
  for (const program of programs) {
    if (!distinctPrograms.has(program.name)) {
      let { hobbies, levelsOfCare } = program;
      const hobbiesList = (hobbies ?? '').split(',');
      const levelsOfCareList = (levelsOfCare ?? '').split(',');

      distinctPrograms.set(program.name, {
        hobbies: hobbiesList,
        levelsOfCare: levelsOfCareList
      });
    }
  }
  return distinctPrograms;
}

export function getResidentsFromDateTime(fromDateTime: number): Set<string>{
  // check programs starting from fromDateTime 
  const programsStartAtFrom = programs.filter(p => (new Date(p.end)).getTime() > fromDateTime);
  // check attendees between that day and today
  const residentsRecentlyAttended = new Set<string>();
  for(const program of programsStartAtFrom){
    for (const resident of program.attendees){
      residentsRecentlyAttended.add(resident.userId);
    }
  }
  return residentsRecentlyAttended;
}

type ResidentProps = Pick<typeof residents[0], 'hobbies' | 'levelOfCare'>;
export function getIsolatedResidents(residentsRecentlyAttended: Set<string>): Map<string, ResidentProps>{
  // isolated residents
  const isolatedResidents = new Map<string, ResidentProps>;
  for (const resident of residents){
    if (!residentsRecentlyAttended.has(resident.userId)) {
      let { hobbies, levelOfCare } = resident;
      isolatedResidents.set(resident.userId, { hobbies, levelOfCare }); 
    }
  }
  return isolatedResidents;
}


export function programHasResidentHobbies(programHobbies: string[], residentHobbies: string[]): boolean {
  for (const h1 of programHobbies){
    for (const h2 of residentHobbies) {
      if (h1 == h2) return true;
    }
  }
  return false;
}

export function getProgramsForIsolatedResidents(isolatedResidents: Map<string, ResidentProps>, distinctPrograms: Map<string, DistinctProgramProps>) : Map<string, number>{
  const programsMap = new Map<string, number>();

  for (const [_, props] of isolatedResidents){
    let { hobbies, levelOfCare } = props;
    
    levelOfCare = levelOfCare ?? '';
    const hobbyList = (hobbies ?? '').split(',');
    for (const [programName, programProps] of distinctPrograms){
      if (
        programHasResidentHobbies(programProps.hobbies, hobbyList)
        && programProps.levelsOfCare.includes(levelOfCare)
      ){
        programsMap.set(programName, (programsMap.get(programName) ?? 0)+1);
      }
    }
  }
  return programsMap;
}
