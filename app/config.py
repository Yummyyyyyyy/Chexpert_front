"""
配置文件 - Configuration Settings
所有配置项集中管理，方便团队成员修改
"""
from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """
    应用配置类
    使用环境变量或.env文件进行配置
    """

    # ============ 基础配置 ============
    APP_NAME: str = "CheXpert Backend API"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = True  # 生产环境改为False

    # ============ 服务器配置 ============
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True  # 开发模式自动重载，生产环境改为False

    # ============ CORS配置（前后端分离必需）============
    # 【重要】团队成员需要根据前端地址修改
    CORS_ORIGINS: list = [
        "http://localhost:3000",  # 前端开发地址
        "http://localhost:5173",  # Vite默认端口
        "http://127.0.0.1:3000",
        # 【TODO】添加前端生产环境域名
        # "https://your-frontend-domain.com"
    ]

    # ============ 文件上传配置 ============
    UPLOAD_DIR: str = "uploads"  # 上传文件临时存储目录
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB，可根据医学图像大小调整
    ALLOWED_EXTENSIONS: set = {".jpg", ".jpeg", ".png", ".dcm"}  # 支持的图像格式

    # ============ Colab API 配置 ============
    # LLaVA 模型通过 Colab 远程调用
    # COLAB_API_URL: Optional[str] = None  # Colab API 地址 (例如: https://xxxx.ngrok.io/predict)
    # 【重要】部署 Colab 后,请设置此 URL
    # 步骤:
    # 1. 在 Colab 中运行 LLaVA 推理服务
    # 2. 使用 ngrok 或 Cloudflare Tunnel 映射到公网
    # 3. 将映射后的 URL 填写到这里
    # 例如: COLAB_API_URL = "https://abc123.ngrok.io/predict"
    COLAB_API_URL: str = "https://electrophoretic-garnet-bouncily.ngrok-free.dev/predict"

    # ============ 第三方API配置 ============
    # 【TODO】团队成员需要添加实际的API密钥
    THIRD_PARTY_API_URL: Optional[str] = None  # 知识图谱API地址
    THIRD_PARTY_API_KEY: Optional[str] = None  # API密钥
    API_TIMEOUT: int = 120  # API调用超时时间（秒） - Colab 推理可能需要较长时间

    # ============ 日志配置 ============
    LOG_LEVEL: str = "INFO"  # DEBUG/INFO/WARNING/ERROR
    LOG_FILE: str = "logs/app.log"

    # ============ 数据库配置（可选）============
    # 如果需要存储用户数据或历史记录
    # DATABASE_URL: Optional[str] = None

    class Config:
        env_file = ".env"  # 从.env文件读取配置
        case_sensitive = True


# 全局配置实例
settings = Settings()


# 启动时创建必要的目录
def init_directories():
    """初始化必要的目录结构"""
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs("logs", exist_ok=True)
    print(f"✅ 目录初始化完成: {settings.UPLOAD_DIR}, logs")
