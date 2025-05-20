const Workout = require('../models/Workout');

exports.addWorkout = async (req, res, next) => {
  try {
    const { name, duration } = req.body;

    const newWorkout = await Workout.create({
      userId: req.user.id, // From decoded JWT
      name,
      duration
    });

    // Format response explicitly to match required structure
    res.status(201).json({
      userId: newWorkout.userId.toString(),   // ensure string format
      name: newWorkout.name,
      duration: newWorkout.duration,
      status: newWorkout.status,
      _id: newWorkout._id.toString(),
      dateAdded: newWorkout.dateAdded.toISOString()
    });

  } catch (err) {
    next(err);
  }
};

exports.getMyWorkouts = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const workouts = await Workout.find({ userId });

    const formattedWorkouts = workouts.map(workout => ({
      _id: workout._id.toString(),
      userId: workout.userId.toString(),
      name: workout.name,
      duration: workout.duration,
      status: workout.status,
      dateAdded: workout.dateAdded.toISOString()
    }));

    res.status(200).json({ workouts: formattedWorkouts });

  } catch (err) {
    next(err);
  }
};

exports.updateWorkout = async (req, res, next) => {
  try {
    const workoutId = req.params.id;
    const updates = req.body;

    const updatedWorkout = await Workout.findOneAndUpdate(
      { _id: workoutId, userId: req.user.id },
      updates,
      { new: true } // returns the updated document
    );

    if (!updatedWorkout) {
      return res.status(404).json({ message: 'Workout not found or unauthorized' });
    }

    res.status(200).json({
      message: 'Workout updated successfully',
      updatedWorkout: {
        _id: updatedWorkout._id.toString(),
        userId: updatedWorkout.userId.toString(),
        name: updatedWorkout.name,
        duration: updatedWorkout.duration,
        status: updatedWorkout.status,
        dateAdded: updatedWorkout.dateAdded.toISOString(),
        __v: updatedWorkout.__v
      }
    });

  } catch (err) {
    next(err);
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Workout.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Workout not found' });
    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeWorkoutStatus = async (req, res, next) => {
  try {
    const workoutId = req.params.id;

    const updatedWorkout = await Workout.findOneAndUpdate(
      { _id: workoutId, userId: req.user.id },
      { status: 'completed' },
      { new: true }
    );

    if (!updatedWorkout) {
      return res.status(404).json({ message: 'Workout not found or unauthorized' });
    }

    res.status(200).json({
      message: "Workout status updated successfully",
      updatedworkout: {
        _id: updatedWorkout._id.toString(),
        userId: updatedWorkout.userId.toString(),
        name: updatedWorkout.name,
        duration: updatedWorkout.duration,
        status: updatedWorkout.status,
        dateAdded: updatedWorkout.dateAdded.toISOString(),
        __v: updatedWorkout.__v
      }
    });

  } catch (err) {
    next(err);
  }
};
