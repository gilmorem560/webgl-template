module main {
    var _gl: WebGL2RenderingContext;
    var _program: WebGLProgram;

    var vertexShaderSource: string = `#version 300 es
    layout (location = 0) in vec2 aPos;
    
    out vec4 vertexColor;
    
    void main()
    {
        gl_Position = vec4(aPos, 0.0, 1.0);
        vertexColor = vec4(0.5, 0.0, 0.0, 1.0);
    }`;

    var fragmentShaderSource: string = `#version 300 es
    precision mediump float;

    out vec4 FragColor;
    
    in vec4 vertexColor;
    
    void main()
    {
        FragColor = vertexColor;
    }`;

    export function main(): void
    {
        var canvas: HTMLCanvasElement;
        var actionButton: HTMLButtonElement;
        var vertexShader: WebGLShader;
        var fragmentShader: WebGLShader;

        canvas = document.createElement("canvas") as HTMLCanvasElement;
        document.body.appendChild(canvas);

        actionButton = document.createElement("button") as HTMLButtonElement;
            actionButton.id = "actionButton";
            actionButton.innerText = "Act";
            actionButton.onclick = actionButton_onclick;
            actionButton.type = "button";
        document.body.appendChild(actionButton);

        _gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

        _gl.enable(_gl.DEPTH_TEST);
        _gl.clearColor(0.0, 0.0, 0.0, 0.0);

        vertexShader = _gl.createShader(_gl.VERTEX_SHADER);
            _gl.shaderSource(vertexShader, vertexShaderSource);
            _gl.compileShader(vertexShader);

            if (!_gl.getShaderParameter(vertexShader, _gl.COMPILE_STATUS))
                throw "Could not compile WebGL program. \n\n" + _gl.getShaderInfoLog(vertexShader);

        fragmentShader = _gl.createShader(_gl.FRAGMENT_SHADER);
            _gl.shaderSource(fragmentShader, fragmentShaderSource);
            _gl.compileShader(fragmentShader);

            if (!_gl.getShaderParameter(fragmentShader, _gl.COMPILE_STATUS))
                throw "Could not compile WebGL program. \n\n" + _gl.getShaderInfoLog(fragmentShader);

        _program = _gl.createProgram();
            _gl.attachShader(_program, vertexShader);
            _gl.attachShader(_program, fragmentShader);
            _gl.linkProgram(_program);

            if (!_gl.getProgramParameter(_program, _gl.LINK_STATUS))
                throw "Could not compile WebGL program. \n\n" + _gl.getProgramInfoLog(_program);

        _gl.useProgram(_program);
    }

    function actionButton_onclick(ev: MouseEvent): void
    {
        var actionButton: HTMLButtonElement;
        var vao: WebGLVertexArrayObject;
        var position: WebGLBuffer;

        actionButton = ev.currentTarget as HTMLButtonElement;
        console.log(actionButton.innerText);

        vao = _gl.createVertexArray();
            _gl.bindVertexArray(vao);

        position = _gl.createBuffer();
            _gl.enableVertexAttribArray(0);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, position);

            _gl.vertexAttribPointer(0, 2, _gl.FLOAT, false, 0, 0);

            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array([
                0.0, 1.0
                ,1.0, -1.0
                ,-1.0, -1.0
            ]), _gl.STATIC_DRAW);

        _gl.drawArrays(_gl.TRIANGLES, 0, 3);
    }
}