import projectModel from '../models/projectModel.js';
import * as projectService from '../services/projectService.js';
import userModel from '../models/userModel.js';
import { validationResult } from 'express-validator';


export const createProject = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {name} = req.body;
        const loggedInUser = await userModel.findOne({email: req.user.email});
        const userId = loggedInUser._id;
    
        const newProject = await projectService.createProject({name, userId});
        res.status(201).json(newProject);
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getAllProjects = async (req, res) => {
    try {
        
        const loggedInUser = await userModel.findOne({email: req.user.email});

        const allUserProjects = await projectService.allUserProjects({userId: loggedInUser._id});
        res.status(200).json({
            projects: allUserProjects
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message
        });
    }
}

export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {projectId, users} = req.body;
        const loggedInUser = await userModel.findOne({email: req.user.email});
        
        const project = await projectService.addUsersToProject({projectId, users, userId: loggedInUser._id});
        res.status(200).json({
            project,
        });
    } 
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

export const getProjectById = async (req, res) => {
    const { projectId } = req.params;

    try{
        const project = await projectService.getProjectById({projectId});
        res.status(200).json({project});

    }catch(error){
        console.log(error);
        res.status(400).json({ message: error.message });
    }

}