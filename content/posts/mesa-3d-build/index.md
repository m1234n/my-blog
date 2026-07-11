---
title: Mesa 3D编译与测试指南
description: ''
publishDate: "2025-12-14T20:41:53+08:00"
updatedDate: "2026-05-08T22:24:50+08:00"
tags: [Mesa, 图形学]
draft: false
---

环境：香橙派5 + Armbian 26.2.1 trixie

获取代码

```shell
git clone https://gitlab.freedesktop.org/mesa/mesa.git
```



安装meson

```shell
pipx install meson

#添加路径
export PATH="$HOME/.local/bin:$PATH"

fish_add_path /home/m1234n/.local/bin/
```



参考docs/install.rst安装依赖

```shell
sudo apt-get build-dep mesa
sudo apt install python3-sphinx
pipx install hawkmoth
```



编译命令：

```shell
# 配置编译选项
meson setup builddir/ \
    -Dgallium-drivers=llvmpipe \
    -Dvulkan-drivers=panfrost,swrast \
    -Dllvm=enabled \
    -Dplatforms=x11,wayland \
    -Degl=disabled \
    -Dopengl=false \
    -Dgles1=disabled \
    -Dgles2=disabled \
    -Dglx=disabled \
    -Dprefix="$PWD/installdir"

meson setup builddir/ build-tests=true -Dplatforms=wayland -Dvulkan-drivers=panfrost -Dgallium-drivers='' -Dprefix="$PWD/installdir"
meson setup builddir/ -Dbuild-tests=true -Dplatforms=x11 -Dvulkan-drivers=panfrost -Dgallium-drivers='' -Dtools=drm-shim -Dprefix="$PWD/installdir"

#查看编译选项
cd builddir
meson configure
#修改编译选项
meson configure -D option=value 
meson configure -D prefix="$PWD/../installdir"

#编译
meson compile -C builddir/

#执行测试套件
meson test -C builddir/
meson test -C builddir/ --suite panfrost

#安装库文件
meson install -C builddir/

# 进入临时开发环境
meson devenv -C builddir

# 配置环境变量
export VK_DRIVER_FILES=/home/m1234n/mesa/installdir/share/vulkan/icd.d/panfrost_icd.aarch64.json

# 配置drm-shim
export LD_PRELOAD="$PWD/lib/x86_64-linux-gnu/libpanfrost_noop_drm_shim.so"
export PAN_GPU_ID=a867
```

|Product|Architecture|GPU ID|
| -----------| ---------------| --------|
|Mali-T720|Midgard (v4)|720|
|Mali-T860|Midgard (v5)|860|
|Mali-G72|Bifrost (v6)|6221|
|Mali-G52|Bifrost (v7)|7212|
|Mali-G57|Valhall (v9)|9093|
|Mali-G610|Valhall (v10)|a867|



dEQP测试

```shell
# 编译
git clone --depth=1 https://github.com/KhronosGroup/VK-GL-CTS.git
cd VK-GL-CTS
python3 external/fetch_sources.py
sudo apt install libgl1-mesa-dev libxcb1-dev libx11-dev

cmake -S . -B build -G Ninja \
  -DSELECTED_BUILD_TARGETS="deqp-vk" \
  -DDEQP_TARGET="x11_egl" \
  -DCMAKE_DISABLE_FIND_PACKAGE_Wayland=ON

cmake --build build --target deqp-vk

# 运行无头测试
set -e DISPLAY
./build/external/vulkancts/modules/vulkan/deqp-vk -n dEQP-VK.info.device
./build/external/vulkancts/modules/vulkan/deqp-vk -n 'dEQP-VK.api.*' --deqp-watchdog=enable --deqp-log-filename=results.qpa 2>&1 | tee run.log

# 使用deqp-runner
cargo install deqp-runner
deqp-runner \
    --deqp ./deqp-vk \
    --include 'dEQP-VK.renderpass.*' \
    --include 'dEQP-VK.synchronization.*' \
    --output results.txt \
    --jobs 4
```



安装glslang

```shell
# 通过命令安装
sudo apt install glslang-tools
sudo apt install glslang-dev

#从源码安装
git clone https://github.com/KhronosGroup/glslang.git
./update_glslang_sources.py

# "Release" (for CMAKE_BUILD_TYPE) could also be "Debug" or "RelWithDebInfo"
cmake -B build -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX="$(pwd)/install"

#通过vulkan sdk安装  https://vulkan.lunarg.com/sdk/home#linux
#添加库路径
source /vulkansdk_path/setup-env.sh
```



安装llvm-18

```shell
wget https://apt.llvm.org/llvm.sh
chmod +x llvm.sh
sudo ./llvm.sh 18
```



dEQP调试

```shell
sudo apt install vulkan-validationlayers

./deqp-vk -n dEQP-VK.pipeline.pipeline_library.graphics_library.misc.other.null_rendering_create_info_ptr --deqp-validation=enable --deqp-print-validation-errors
```
