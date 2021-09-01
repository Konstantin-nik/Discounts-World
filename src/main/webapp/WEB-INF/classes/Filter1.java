import java.lang.*;
import java.io.*; 
import javax.servlet.*; 
import javax.servlet.http.*; 
import java.io.IOException;
import java.util.Date;


public class Filter1 implements Filter {
    public void init(FilterConfig filterConfig) throws ServletException {
    }
@Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        String dateTime = new Date().toString();


		HttpServletRequest httpRequest = (HttpServletRequest) request;
		HttpServletResponse httpResponse = (HttpServletResponse) response;
		String newPath = httpRequest.getRequestURL().toString(); 
		String method = httpRequest.getMethod();
		long start = System.currentTimeMillis();

        System.out.println();

        System.out.print(method + " - ");
        System.out.print(newPath + " - ");

        chain.doFilter(request, response);
		long finish = System.currentTimeMillis();
		long timeElapsed = finish - start;
        System.out.println(timeElapsed + "ms");
    }

    public void destroy() {

    }
}
