import Task from "../model/taskModel.js";



export const create = async (req, res) => {
    try {
      const newTask = new Task(req.body);
      const { title } = newTask;
  
      const taskExist = await Task.findOne({ title });
      if (taskExist) {
        return res.status(400).json({ errorMessage: "Task already exists" });
      }
  
      const savedData = await newTask.save();
      res.status(200).json({ message: "User created successfully." });
    } catch (error) {
      res.status(500).json({ errorMessage: error.message });
    }
  };
  


  export const getAllTask = async(req, res) => {
    try{
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Sorting
        const sortField = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
        const sort = { [sortField]: sortOrder };

        // Filtering
        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.startDate) {
            filter.createdAt = { $gte: new Date(req.query.startDate) };
        }
        if (req.query.endDate) {
            filter.createdAt = { ...filter.createdAt, $lte: new Date(req.query.endDate) };
        }

        const allTasks = await Task.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);
        
        const totalTasks = await Task.countDocuments(filter);
        
        if (!allTasks || allTasks.length === 0) {
            return res.status(404).json({ message: "No tasks found" });
        }
        
        res.status(200).json({
            tasks: allTasks,
            total: totalTasks,
            page,
            pages: Math.ceil(totalTasks / limit)
        });
    } catch(error) {
        res.status(500).json({errorMessage:error.message})
    }
}

export const getTaskById = async (req, res) => {
    try{
        const  id  = req.params.id;
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(task);
        }catch(error){  
            res.status(500).json({errorMessage:error.message})
        }
    };


export const updateTask = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }else{
            const updatedData = await Task.findByIdAndUpdate(  id,
                {
                  $set: {
                    title: req.body.title,
                    description: req.body.description,
                    status: req.body.status,
                    updatedAt: new Date() // Manually set updated date
                  }
                },
                { new: true })
            res.status(200).json(updatedData);
        }
    }catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }

};

export const deleteTask = async (req, res) => {
    try { 
        const id = req.params.id;
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        await Task.findByIdAndDelete(id);
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};