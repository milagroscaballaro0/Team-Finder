import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient();

export const createCompany = async (req, res) => {
  try {
    const { name, description, website, location, userId } = req.body;

    console.log('🏢 Creando empresa:', { name, userId });

    if (!name || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y userId son requeridos'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const existingCompany = await prisma.company.findUnique({
      where: { userId: parseInt(userId) }
    });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya tiene una empresa registrada'
      });
    }

    const company = await prisma.company.create({
      data: {
        name,
        description,
        website,
        location,
        userId: parseInt(userId)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { role: 'company' }
    });

    console.log('✅ Empresa creada:', company.name);

    res.status(201).json({
      success: true,
      message: 'Empresa creada exitosamente',
      company
    });

  } catch (error) {
    console.error('❌ Error creando empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getCompanies = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          jobs: {
            select: {
              id: true,
              title: true,
              type: true,
              location: true,
              createdAt: true
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.company.count({ where })
    ]);

    res.json({
      success: true,
      companies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo empresas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
          }
        },
        jobs: {
          include: {
            applications: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }

    res.json({
      success: true,
      company
    });

  } catch (error) {
    console.error('❌ Error obteniendo empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, website, location } = req.body;

    const company = await prisma.company.findUnique({
      where: { id: parseInt(id) }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }

    const updatedCompany = await prisma.company.update({
      where: { id: parseInt(id) },
      data: {
        name: name || company.name,
        description: description !== undefined ? description : company.description,
        website: website !== undefined ? website : company.website,
        location: location !== undefined ? location : company.location
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Empresa actualizada exitosamente',
      company: updatedCompany
    });

  } catch (error) {
    console.error('❌ Error actualizando empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};