"""
FastAPI 主应用入口
启动命令:
  方式1: python run.py (推荐)
  方式2: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
import sys

from app.config import settings, init_directories
from app.api.v1.router import api_router


# 配置日志
logger.remove()  # 移除默认处理器
logger.add(
    sys.stdout,
    colorize=True,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan> - <level>{message}</level>",
    level=settings.LOG_LEVEL
)
logger.add(
    settings.LOG_FILE,
    rotation="500 MB",
    retention="10 days",
    level=settings.LOG_LEVEL
)


# 创建FastAPI应用实例
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
    CheXpert 医学影像分析后端API

    ## 功能模块

    * **图像分析**: 上传X光片，返回热力图和分类结果
    * **报告生成**: 基于自研LLaVA模型生成医学报告
    * **知识图谱**: 调用第三方API生成疾病知识图谱

    ## 开发团队

    前后端协作项目，详见API文档
    """,
    docs_url="/docs",  # Swagger UI文档地址
    redoc_url="/redoc",  # ReDoc文档地址
)


# ============ CORS中间件配置 ============
# 【重要】允许前端跨域请求
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,  # 允许的前端域名
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有HTTP方法
    allow_headers=["*"],  # 允许所有请求头
)


# ============ 启动事件 ============
@app.on_event("startup")
async def startup_event():
    """应用启动时执行"""
    logger.info(f"🚀 启动 {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"📝 API文档地址: http://{settings.HOST}:{settings.PORT}/docs")
    logger.info(f"🌍 环境: {'开发模式' if settings.DEBUG else '生产模式'}")

    # 初始化目录
    init_directories()

    # 【TODO】这里可以添加模型预加载逻辑（可选）
    # 如果模型较大，可以在启动时加载到内存
    # logger.info("📦 正在加载模型...")
    # from app.models.model_manager import ModelManager
    # model_manager = ModelManager()
    # await model_manager.load_models()
    # logger.success("✅ 模型加载完成")


@app.on_event("shutdown")
async def shutdown_event():
    """应用关闭时执行"""
    logger.info("👋 应用正在关闭...")
    # 【TODO】这里可以添加资源清理逻辑
    # 例如：关闭数据库连接、保存缓存等


# ============ 根路由 ============
@app.get("/", tags=["根路由"])
async def root():
    """根路径，返回欢迎信息"""
    return {
        "message": "Welcome to CheXpert Backend API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/health"
    }


# ============ 健康检查接口 ============
@app.get("/health", tags=["健康检查"])
async def health_check():
    """
    健康检查接口
    用于前端或运维团队检查后端服务是否正常运行
    """
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "debug_mode": settings.DEBUG
    }


# ============ 注册API路由 ============
# 所有业务接口都挂载在 /api/v1 路径下
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


# ============ 异常处理（可选）============
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """处理请求参数验证错误"""
    logger.error(f"请求参数验证失败: {exc}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "参数验证失败",
            "detail": exc.errors()
        }
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """全局异常处理器"""
    logger.exception(f"未处理的异常: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "服务器内部错误",
            "message": str(exc) if settings.DEBUG else "请联系管理员"
        }
    )


if __name__ == "__main__":
    import uvicorn

    # 直接运行此文件启动服务
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD,
        log_level=settings.LOG_LEVEL.lower()
    )
