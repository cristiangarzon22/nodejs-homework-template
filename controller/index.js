const service = require("../service");

const get = async (req, res, next) => {
  try {
    const results = await service.getAllContacts(); 
    res.json({
      status: "success",
      code: 200,
      data: {
        data: results,
      },
    });
  } catch (error) {
    console.error("ha sucedido un error",error);
    next(error);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await service.getContactById(id);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: {
          data: result,
        },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Cat not found by id ${id}`,
        data: "Not found",
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const create = async (req, res, next) => {
  const { name, email, phone, favorite } = req.body;
  try {
    const result = await service.createContact({ name, email, phone, favorite });

    res.status(201).json({
      status: "success",
      code: 201,
      data: { data: result },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, favorite } = req.body;

  try {
    const result = await service.updateContact(id, { name, email, phone, favorite });
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { data: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Cat not found by id ${id}`,
        data: "Not found",
      });
    }
  } catch (error) {
    console.error(error);
    next();
  }
};

const remove = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await service.removeContact(id);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { data: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Cat not found by id ${id}`,
        data: "Not found",
      });
    }
  } catch (error) {
    console.error(error);
    next();
  }
};

const updateStatusFavorite = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, favorite } = req.body;
  try {
    const result = await service.updateStatusContact( id, { name, email, phone, favorite });////
    if (result) {
      res.status(200).json({
        status: "success",
        code: 200,
        data: { data: result },
      });
    } else {
      res.status(400).json({
        status: "error",
        code: 400,
        message: "missing field favorite",
        data: "Not found",
      });
    }
  } catch (error) {
    console.error(error);
    next();
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  remove,
  updateStatusFavorite,
};
