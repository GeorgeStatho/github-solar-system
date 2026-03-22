import { createSolarSystemData } from "../../core/builders/createSolarSystemData";
import { GitUser } from "./GitHubUser";

export async function mapGitHubReposToSolarSystem(userName:string){
    const user = new GitUser(userName);
    await user.fillRepos();
    return createSolarSystemData(user.toSolarSystemData());
}
