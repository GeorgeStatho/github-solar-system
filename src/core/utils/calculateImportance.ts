function clamp(value:number,min:number,max:number){
    return Math.max(min,Math.min(max,value));
}

function getRecencyScore(date:string){
    const updatedAt = new Date(date).getTime();

    if (!Number.isFinite(updatedAt)) {
        return 0;
    }

    const ageInDays = (Date.now() - updatedAt) / (1000 * 60 * 60 * 24);
    return clamp(100 - (ageInDays / 365) * 100,0,100);
}

function getLogScore(value:number,maxReference:number){
    if (value <= 0) {
        return 0;
    }

    return clamp((Math.log(value + 1) / Math.log(maxReference + 1)) * 100,0,100);
}

export function calculateImportance(date:string,commits:number,xNum:number){
    const recencyScore = getRecencyScore(date);
    const commitScore = getLogScore(commits,500);
    const branchScore = getLogScore(xNum,20);

    return 0.45 * recencyScore + 0.40 * commitScore + 0.15 * branchScore;
}
